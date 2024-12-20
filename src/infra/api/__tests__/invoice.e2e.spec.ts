import Address from '../../../modules/@shared/domain/value-object/address.value-object'
import Id from '../../../modules/@shared/domain/value-object/id.value-object'
import Invoice from '../../../modules/invoice/domain/invoice.entity'
import Product from '../../../modules/invoice/domain/product.entity'
import InvoiceRepository from '../../../modules/invoice/repository/transaction.repository'
import { app, sequelize } from '../express'
import request from 'supertest'

describe('E2E test for invoice', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it('should do the invoice', async () => {
    const address = new Address(
      'Main Street',
      '123',
      'Next to the bank',
      'New York',
      'New York',
      '122343404',
    )

    const product1 = new Product({
      id: new Id('1'),
      name: 'Product 1',
      price: 100,
    })

    const product2 = new Product({
      id: new Id('2'),
      name: 'Product 2',
      price: 200,
    })

    const invoice = new Invoice({
      id: new Id('123'),
      name: 'Invoice 1',
      document: 'Document 1',
      items: [product1, product2],
      address,
    })

    const invoiceRepository = new InvoiceRepository()

    await invoiceRepository.create(invoice)
    const response = await request(app).get(`/invoice/${123}`)

    expect(response.status).toEqual(200)
    expect(response.body.name).toEqual('Invoice 1')
  })
})
