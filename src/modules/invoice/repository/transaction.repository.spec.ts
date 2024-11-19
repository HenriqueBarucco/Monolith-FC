import Address from '../../@shared/domain/value-object/address.value-object'
import Id from '../../@shared/domain/value-object/id.value-object'
import Invoice from '../domain/invoice.entity'
import Product from '../domain/product.entity'
import InvoiceItemModel from './transaction.item.model'
import InvoiceModel from './transaction.model'
import { Sequelize } from 'sequelize-typescript'
import InvoiceRepository from './transaction.repository'

describe('InvoiceRepository test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    })
    await sequelize.addModels([InvoiceModel, InvoiceItemModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a invoice', async () => {
    const invoice = new Invoice({
      id: new Id('1'),
      name: 'John Doe',
      document: '123456789',
      address: new Address(
        'Street',
        '123',
        'Complement',
        'City',
        'State',
        '12345678',
      ),
      items: [
        new Product({
          id: new Id('1'),
          name: 'Item 1',
          price: 100,
        }),
        new Product({
          id: new Id('2'),
          name: 'Item 2',
          price: 200,
        }),
      ],
    })
    const repository = new InvoiceRepository()
    await repository.create(invoice)

    const result = await InvoiceModel.findOne({
      where: { id: '1' },
      include: [InvoiceItemModel],
    })

    expect(result).toBeDefined()
    expect(result.dataValues.id).toBe(invoice.id.id)
    expect(result.dataValues.name).toBe(invoice.name)
    expect(result.dataValues.document).toBe(invoice.document)
    expect(result.dataValues.street).toBe(invoice.address.street)
    expect(result.dataValues.number).toBe(invoice.address.number)
    expect(result.dataValues.complement).toBe(invoice.address.complement)
    expect(result.dataValues.city).toBe(invoice.address.city)
    expect(result.dataValues.state).toBe(invoice.address.state)
    expect(result.dataValues.zipCode).toBe(invoice.address.zipCode)
    expect(result.dataValues.items).toHaveLength(2)
    expect(result.dataValues.items[0].dataValues.id).toBe(
      invoice.items[0].id.id,
    )
    expect(result.dataValues.items[0].dataValues.name).toBe(
      invoice.items[0].name,
    )
    expect(result.dataValues.items[0].dataValues.price).toBe(
      invoice.items[0].price,
    )
    expect(result.dataValues.items[1].dataValues.id).toBe(
      invoice.items[1].id.id,
    )
    expect(result.dataValues.items[1].dataValues.name).toBe(
      invoice.items[1].name,
    )
    expect(result.dataValues.items[1].dataValues.price).toBe(
      invoice.items[1].price,
    )
    expect(result.dataValues.total).toBe(300)
  })

  it('should find a invoice', async () => {
    const invoice = new Invoice({
      id: new Id('1'),
      name: 'John Doe',
      document: '123456789',
      address: new Address(
        'Street',
        '123',
        'Complement',
        'City',
        'State',
        '12345678',
      ),
      items: [
        new Product({
          id: new Id('1'),
          name: 'Item 1',
          price: 100,
        }),
        new Product({
          id: new Id('2'),
          name: 'Item 2',
          price: 200,
        }),
      ],
    })
    const repository = new InvoiceRepository()
    await repository.create(invoice)

    const result = await repository.find(invoice.id.id)

    expect(result).toBeDefined()
    expect(result.id.id).toBe(invoice.id.id)
    expect(result.name).toBe(invoice.name)
    expect(result.document).toBe(invoice.document)
    expect(result.address.street).toBe(invoice.address.street)
    expect(result.address.number).toBe(invoice.address.number)
    expect(result.address.complement).toBe(invoice.address.complement)
    expect(result.address.city).toBe(invoice.address.city)
    expect(result.address.state).toBe(invoice.address.state)
    expect(result.address.zipCode).toBe(invoice.address.zipCode)
    expect(result.items).toHaveLength(2)
    expect(result.items[0].id.id).toBe(invoice.items[0].id.id)
    expect(result.items[0].name).toBe(invoice.items[0].name)
    expect(result.items[0].price).toBe(invoice.items[0].price)
    expect(result.items[1].id.id).toBe(invoice.items[1].id.id)
    expect(result.items[1].name).toBe(invoice.items[1].name)
    expect(result.items[1].price).toBe(invoice.items[1].price)
    expect(result.total).toBe(300)
  })
})
