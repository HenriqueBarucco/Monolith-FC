import { Sequelize } from 'sequelize-typescript'
import Id from '../../@shared/domain/value-object/id.value-object'
import Product from '../domain/product.entity'
import ProductRepository from './product.repository'
import ProductModel from './product.model'

describe('ProductRepository test', () => {
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
    const productProps = {
      id: new Id('1'),
      name: 'Product 1',
      description: 'Product 1 description',
      purchasePrice: 100,
      stock: 10,
    }
    const product = new Product(productProps)
    const productRepository = new ProductRepository()
    await productRepository.add(product)

    const productDb = await ProductModel.findOne({
      where: { id: productProps.id.id },
    })

    expect(productProps.id.id).toEqual(productDb.dataValues.id)
    expect(productProps.name).toEqual(productDb.dataValues.name)
    expect(productProps.description).toEqual(productDb.dataValues.description)
    expect(productProps.purchasePrice).toEqual(
      productDb.dataValues.purchasePrice,
    )
    expect(productProps.stock).toEqual(productDb.dataValues.stock)
  })

  it('should find a product', async () => {
    const productRepository = new ProductRepository()

    await ProductModel.create({
      id: '1',
      name: 'Product 1',
      description: 'Product 1 description',
      purchasePrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const product = await productRepository.find('1')

    expect(product).toBeDefined()
  })
})