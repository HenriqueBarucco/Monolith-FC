import { Sequelize } from 'sequelize-typescript'
import ProductAdmFacadeFactory from '../factory/facade.factory'
import ProductModel from '../repository/product.model'

describe('ProductAdmFacade test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    })

    await sequelize.addModels([ProductModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a product', async () => {
    const productFacade = ProductAdmFacadeFactory.create()

    const input = {
      id: '1',
      name: 'Product 1',
      description: 'Product 1 description',
      purchasePrice: 10,
      stock: 10,
    }

    await productFacade.addProduct(input)

    const product = await ProductModel.findOne({ where: { id: '1' } })
    expect(product).toBeDefined()
    expect(product.dataValues.id).toBe(input.id)
    expect(product.dataValues.name).toBe(input.name)
    expect(product.dataValues.description).toBe(input.description)
    expect(product.dataValues.purchasePrice).toBe(input.purchasePrice)
    expect(product.dataValues.stock).toBe(input.stock)
  })

  // it('should check product stock', async () => {
  //   const productFacade = ProductAdmFacadeFactory.create()
  //   const input = {
  //     id: '1',
  //     name: 'Product 1',
  //     description: 'Product 1 description',
  //     purchasePrice: 10,
  //     stock: 10,
  //   }
  //   await productFacade.addProduct(input)

  //   const result = await productFacade.checkStock({ productId: '1' })

  //   expect(result.productId).toBe(input.id)
  //   expect(result.stock).toBe(input.stock)
  // })
})
