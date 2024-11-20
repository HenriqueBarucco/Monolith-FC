import { ClientModel } from '../../../modules/client-adm/repository/client.model'
import { app, sequelize } from '../express'
import request from 'supertest'
import { migrator } from '../config/migrations/migrator'
import { Umzug } from 'umzug'
import ProductModel from '../../../modules/product-adm/repository/product.model'
import ProductStockModel from '../../../modules/store-catalog/repository/product.model'

describe('E2E test for checkout', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let migration: Umzug<any>
  beforeEach(async () => {
    migration = migrator(sequelize)
    await migration.up()
  })

  afterAll(async () => {
    if (!migration || !sequelize) {
      return
    }
    migration = migrator(sequelize)
    await migration.down()
  })

  it('should do the checkout', async () => {
    await ClientModel.create({
      id: '1',
      name: 'Client 1',
      email: 'client@example.com',
      street: 'Main Street',
      number: '123',
      city: 'New York',
      state: 'New York',
      zipcode: '123456',
      document: '0000',
      complement: 'Complement',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await ProductModel.create({
      id: '1',
      name: 'My Product',
      description: 'Product description',
      purchasePrice: 100,
      stock: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await ProductStockModel.update(
      { salesPrice: 100 },
      {
        where: { id: '1' },
      },
    )

    await ProductModel.create({
      id: '2',
      name: 'My Product 2',
      description: 'Product description',
      purchasePrice: 200,
      stock: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await ProductStockModel.update(
      { salesPrice: 200 },
      {
        where: { id: '2' },
      },
    )

    const response = await request(app)
      .post('/checkout')
      .send({
        clientId: '1',
        products: [{ productId: '1' }, { productId: '2' }],
      })

    expect(response.status).toEqual(200)
    expect(response.body.id).toBeDefined()
    expect(response.body.invoiceId).toBeDefined()
    expect(response.body.total).toEqual(300)
    expect(response.body.status).toEqual('approved')
  })
})
