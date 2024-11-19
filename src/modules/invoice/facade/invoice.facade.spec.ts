import { Sequelize } from 'sequelize-typescript'
import InvoiceFacadeFactory from '../factory/invoice.facade.factory'
import InvoiceItemModel from '../repository/transaction.item.model'
import InvoiceModel from '../repository/transaction.model'
import InvoiceRepository from '../repository/transaction.repository'
import FindInvoiceUseCase from '../usecase/find/find-invoice.usecase'
import GenerateInvoiceUseCase from '../usecase/generate/generate-invoice.usecase'
import InvoiceFacade from './invoice.facade'

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
    const facade = InvoiceFacadeFactory.create()

    const invoice = {
      id: '1',
      name: 'John Doe',
      document: '123456789',
      street: 'Street',
      number: '123',
      complement: 'Complement',
      city: 'City',
      state: 'State',
      zipCode: '12345678',
      items: [
        {
          id: '1',
          name: 'Item 1',
          price: 100,
        },
        {
          id: '2',
          name: 'Item 2',
          price: 200,
        },
      ],
    }

    const output = await facade.create(invoice)

    const result = await InvoiceModel.findOne({
      where: { id: output.id },
      include: [InvoiceItemModel],
    })
    expect(result).toBeDefined()
    expect(result.dataValues.id).toBeDefined()
    expect(result.dataValues.name).toBe(invoice.name)
    expect(result.dataValues.document).toBe(invoice.document)
    expect(result.dataValues.street).toBe(invoice.street)
    expect(result.dataValues.number).toBe(invoice.number)
    expect(result.dataValues.complement).toBe(invoice.complement)
    expect(result.dataValues.city).toBe(invoice.city)
    expect(result.dataValues.state).toBe(invoice.state)
    expect(result.dataValues.zipCode).toBe(invoice.zipCode)
    expect(result.dataValues.items).toHaveLength(2)
    expect(result.dataValues.items[0].dataValues.id).toBe(invoice.items[0].id)
    expect(result.dataValues.items[0].dataValues.name).toBe(
      invoice.items[0].name,
    )
    expect(result.dataValues.items[0].dataValues.price).toBe(
      invoice.items[0].price,
    )
    expect(result.dataValues.items[1].dataValues.id).toBe(invoice.items[1].id)
    expect(result.dataValues.items[1].dataValues.name).toBe(
      invoice.items[1].name,
    )
    expect(result.dataValues.items[1].dataValues.price).toBe(
      invoice.items[1].price,
    )
    expect(result.dataValues.total).toBe(300)
  })

  it('should find a invoice', async () => {
    const repository = new InvoiceRepository()
    const CreateUsecase = new GenerateInvoiceUseCase(repository)
    const FindUsecase = new FindInvoiceUseCase(repository)
    const facade = new InvoiceFacade({
      create: CreateUsecase,
      find: FindUsecase,
    })

    const invoice = {
      id: '1',
      name: 'John Doe',
      document: '123456789',
      street: 'Street',
      number: '123',
      complement: 'Complement',
      city: 'City',
      state: 'State',
      zipCode: '12345678',
      items: [
        {
          id: '1',
          name: 'Item 1',
          price: 100,
        },
        {
          id: '2',
          name: 'Item 2',
          price: 200,
        },
      ],
    }

    const output = await facade.create(invoice)
    const resultFind = await facade.find(output.id)
    expect(resultFind).toBeDefined()
    expect(resultFind.id).toBeDefined()
    expect(resultFind.name).toBe(invoice.name)
    expect(resultFind.document).toBe(invoice.document)
    expect(resultFind.address.street).toBe(invoice.street)
    expect(resultFind.address.number).toBe(invoice.number)
    expect(resultFind.address.complement).toBe(invoice.complement)
    expect(resultFind.address.city).toBe(invoice.city)
    expect(resultFind.address.state).toBe(invoice.state)
    expect(resultFind.address.zipCode).toBe(invoice.zipCode)
    expect(resultFind.items).toHaveLength(2)
    expect(resultFind.items[0].id).toBe(invoice.items[0].id)
    expect(resultFind.items[0].name).toBe(invoice.items[0].name)
    expect(resultFind.items[0].price).toBe(invoice.items[0].price)
    expect(resultFind.items[1].id).toBe(invoice.items[1].id)
    expect(resultFind.items[1].name).toBe(invoice.items[1].name)
    expect(resultFind.items[1].price).toBe(invoice.items[1].price)
    expect(resultFind.total).toBe(300)
  })

  it('should create a invoice using factory', async () => {
    const facade = InvoiceFacadeFactory.create()

    const invoice = {
      id: '1',
      name: 'John Doe',
      document: '123456789',
      street: 'Street',
      number: '123',
      complement: 'Complement',
      city: 'City',
      state: 'State',
      zipCode: '12345678',
      items: [
        {
          id: '1',
          name: 'Item 1',
          price: 100,
        },
        {
          id: '2',
          name: 'Item 2',
          price: 200,
        },
      ],
    }

    const output = await facade.create(invoice)

    const result = await InvoiceModel.findOne({
      where: { id: output.id },
      include: [InvoiceItemModel],
    })

    expect(result).toBeDefined()
    expect(result.dataValues.id).toBeDefined()
    expect(result.dataValues.name).toBe(invoice.name)
    expect(result.dataValues.document).toBe(invoice.document)
    expect(result.dataValues.street).toBe(invoice.street)
    expect(result.dataValues.number).toBe(invoice.number)
    expect(result.dataValues.complement).toBe(invoice.complement)
    expect(result.dataValues.city).toBe(invoice.city)
    expect(result.dataValues.state).toBe(invoice.state)
    expect(result.dataValues.zipCode).toBe(invoice.zipCode)
    expect(result.dataValues.items).toHaveLength(2)
    expect(result.dataValues.items[0].dataValues.id).toBe(invoice.items[0].id)
    expect(result.dataValues.items[0].dataValues.name).toBe(
      invoice.items[0].name,
    )
    expect(result.dataValues.items[0].dataValues.price).toBe(
      invoice.items[0].price,
    )
    expect(result.dataValues.items[1].dataValues.id).toBe(invoice.items[1].id)
    expect(result.dataValues.items[1].dataValues.name).toBe(
      invoice.items[1].name,
    )
    expect(result.dataValues.items[1].dataValues.price).toBe(
      invoice.items[1].price,
    )
    expect(result.dataValues.total).toBe(300)
  })

  it('should find a invoice using factory', async () => {
    const facade = InvoiceFacadeFactory.create()

    const invoice = {
      id: '1',
      name: 'John Doe',
      document: '123456789',
      street: 'Street',
      number: '123',
      complement: 'Complement',
      city: 'City',
      state: 'State',
      zipCode: '12345678',
      items: [
        {
          id: '1',
          name: 'Item 1',
          price: 100,
        },
        {
          id: '2',
          name: 'Item 2',
          price: 200,
        },
      ],
    }

    const output = await facade.create(invoice)

    const resultFind = await facade.find(output.id)

    expect(resultFind).toBeDefined()
    expect(resultFind.id).toBeDefined()
    expect(resultFind.name).toBe(invoice.name)
    expect(resultFind.document).toBe(invoice.document)
    expect(resultFind.address.street).toBe(invoice.street)
    expect(resultFind.address.number).toBe(invoice.number)
    expect(resultFind.address.complement).toBe(invoice.complement)
    expect(resultFind.address.city).toBe(invoice.city)
    expect(resultFind.address.state).toBe(invoice.state)
    expect(resultFind.address.zipCode).toBe(invoice.zipCode)
    expect(resultFind.items).toHaveLength(2)
    expect(resultFind.items[0].id).toBe(invoice.items[0].id)
    expect(resultFind.items[0].name).toBe(invoice.items[0].name)
    expect(resultFind.items[0].price).toBe(invoice.items[0].price)
    expect(resultFind.items[1].id).toBe(invoice.items[1].id)
    expect(resultFind.items[1].name).toBe(invoice.items[1].name)
    expect(resultFind.items[1].price).toBe(invoice.items[1].price)
    expect(resultFind.total).toBe(300)
  })
})
