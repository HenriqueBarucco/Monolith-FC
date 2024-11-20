import Id from '../../../@shared/domain/value-object/id.value-object'
import { Product } from '../../domain/product.entity'
import { PlaceOrderInputDto } from './place-order.dto'
import { PlaceOrderUseCase } from './place-order.usecase'

const mockDate = new Date(2000, 1, 1)

describe('PlaceOrderUseCase unit test', () => {
  describe('validateProducts method', () => {
    // @ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase()

    it('should throw an error if no products are selected', async () => {
      const input: PlaceOrderInputDto = {
        clientId: '1',
        products: [],
      }

      await expect(placeOrderUseCase.validateProducts(input)).rejects.toThrow(
        new Error('No products selected'),
      )
    })

    it('should throw an error when product is out of stock', async () => {
      const mockProductFacade = {
        checkStock: jest.fn(({ productId }: { productId: string }) =>
          Promise.resolve({
            productId,
            stock: productId === '1' ? 0 : 10,
          }),
        ),
      }

      // @ts-expect-error - force set productFacade
      placeOrderUseCase._productFacade = mockProductFacade

      let input: PlaceOrderInputDto = {
        clientId: '1',
        products: [{ productId: '1' }],
      }

      await expect(placeOrderUseCase.validateProducts(input)).rejects.toThrow(
        new Error('Product 1 is not available in stock'),
      )

      input = {
        clientId: '2',
        products: [{ productId: '2' }, { productId: '1' }],
      }

      await expect(placeOrderUseCase.validateProducts(input)).rejects.toThrow(
        new Error('Product 1 is not available in stock'),
      )
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3)

      input = {
        clientId: '2',
        products: [{ productId: '2' }, { productId: '3' }, { productId: '1' }],
      }

      await expect(placeOrderUseCase.validateProducts(input)).rejects.toThrow(
        new Error('Product 1 is not available in stock'),
      )
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(6)
    })
  })

  describe('getProducts method', () => {
    beforeAll(() => {
      jest.useFakeTimers()
      jest.setSystemTime(mockDate)
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    // @ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase()

    it('should throw error when product not found', async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue(null),
      }

      // @ts-expect-error - force set catalogFacade
      placeOrderUseCase._catalogFacade = mockCatalogFacade

      await expect(placeOrderUseCase.getProduct('0')).rejects.toThrow(
        new Error('Product not found'),
      )
    })

    it('should return a product', async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue({
          id: '1',
          name: 'Product 1',
          description: 'Description 1',
          salesPrice: 100,
        }),
      }

      // @ts-expect-error - force set catalogFacade
      placeOrderUseCase._catalogFacade = mockCatalogFacade

      await expect(placeOrderUseCase.getProduct('1')).resolves.toEqual(
        new Product({
          id: new Id('1'),
          name: 'Product 1',
          description: 'Description 1',
          salesPrice: 100,
        }),
      )

      expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1)
    })
  })

  describe('execute method', () => {
    beforeAll(() => {
      jest.useFakeTimers()
      jest.setSystemTime(mockDate)
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    it('should throw an error when client not found', async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(null),
        add: jest.fn(),
      }

      // @ts-expect-error - no params in constructor
      const placeOrderUseCase = new PlaceOrderUseCase()
      placeOrderUseCase._clientFacade = mockClientFacade

      const input: PlaceOrderInputDto = { clientId: '0', products: [] }

      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
        new Error('Client not found'),
      )
    })

    it('should throw an error when products are not valid', async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(true),
        add: jest.fn(),
      }

      // @ts-expect-error - no params in constructor
      const placeOrderUseCase = new PlaceOrderUseCase()
      placeOrderUseCase._clientFacade = mockClientFacade

      const mockValidateProducts = jest
        .spyOn(placeOrderUseCase, 'validateProducts')
        .mockRejectedValue(new Error('No products selected'))

      const input: PlaceOrderInputDto = { clientId: '1', products: [] }
      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
        new Error('No products selected'),
      )
      expect(mockValidateProducts).toHaveBeenCalledTimes(1)
    })

    describe('place an order', () => {
      const clientProps = {
        id: '1c',
        name: 'Client 1',
        document: '0000',
        email: 'client@email.com',
        address: {
          city: 'City',
          zipCode: '0000',
          street: 'Street',
          state: 'State',
          complement: 'Complement',
          number: '123',
        },
      }

      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(Promise.resolve(clientProps)),
        add: jest.fn(),
      }

      const mockPaymentFacade = {
        process: jest.fn(),
      }

      const mockOrderRepository = {
        addOrder: jest.fn(),
        findOrder: jest.fn(),
      }

      const mockInvoiceFacade = {
        create: jest.fn().mockResolvedValue({ id: '1i' }),
        find: jest.fn(),
      }

      const placeOrderUseCase = new PlaceOrderUseCase(
        mockClientFacade,
        null,
        null,
        mockPaymentFacade,
        mockInvoiceFacade,
        mockOrderRepository,
      )

      const products = {
        '1': new Product({
          id: new Id('1'),
          name: 'Product 1',
          description: 'Description 1',
          salesPrice: 40,
        }),
        '2': new Product({
          id: new Id('2'),
          name: 'Product 2',
          description: 'Description 2',
          salesPrice: 30,
        }),
      }

      const mockValidateProducts = jest
        .spyOn(placeOrderUseCase, 'validateProducts')
        .mockResolvedValue(null)

      const mockGetProduct = jest
        .spyOn(placeOrderUseCase, 'getProduct')
        // @ts-expect-error - not return never
        .mockImplementation((productId: keyof typeof products) => {
          return products[productId]
        })

      it('should not be approved', async () => {
        mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
          transactionId: '1t',
          orderId: '1o',
          amount: 70,
          status: 'error',
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        const input: PlaceOrderInputDto = {
          clientId: clientProps.id,
          products: [{ productId: '1' }, { productId: '2' }],
        }

        const output = await placeOrderUseCase.execute(input)

        expect(output.invoiceId).toEqual(null)
        expect(output.total).toEqual(70)
        expect(output.products).toStrictEqual([
          { productId: '1' },
          { productId: '2' },
        ])

        expect(mockClientFacade.find).toHaveBeenCalledTimes(1)
        expect(mockClientFacade.find).toHaveBeenCalledWith({ id: '1c' })
        expect(mockValidateProducts).toHaveBeenCalledTimes(1)
        expect(mockValidateProducts).toHaveBeenCalledWith(input)
        expect(mockGetProduct).toHaveBeenCalledTimes(2)
        expect(mockOrderRepository.addOrder).toHaveBeenCalledTimes(1)
        expect(mockPaymentFacade.process).toBeCalledTimes(1)
        expect(mockPaymentFacade.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total,
        })
        expect(mockInvoiceFacade.create).toHaveBeenCalledTimes(0)
      })

      it('should be approved', async () => {
        mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
          transactionId: '1t',
          orderId: '1o',
          amount: 70,
          status: 'approved',
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        const input: PlaceOrderInputDto = {
          clientId: clientProps.id,
          products: [{ productId: '1' }, { productId: '2' }],
        }

        const output = await placeOrderUseCase.execute(input)

        expect(output.invoiceId).toEqual('1i')
        expect(output.total).toEqual(70)
        expect(output.products).toStrictEqual([
          { productId: '1' },
          { productId: '2' },
        ])

        expect(mockClientFacade.find).toHaveBeenCalledTimes(1)
        expect(mockClientFacade.find).toHaveBeenCalledWith({ id: '1c' })
        expect(mockValidateProducts).toHaveBeenCalledTimes(1)
        expect(mockGetProduct).toHaveBeenCalledTimes(2)
        expect(mockOrderRepository.addOrder).toHaveBeenCalledTimes(1)
        expect(mockPaymentFacade.process).toBeCalledTimes(1)
        expect(mockPaymentFacade.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total,
        })
        expect(mockInvoiceFacade.create).toHaveBeenCalledTimes(1)
      })
    })
  })
})
