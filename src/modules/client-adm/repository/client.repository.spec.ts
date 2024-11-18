import { Sequelize } from 'sequelize-typescript'
import { ClientModel } from './client.model'
import Client from '../domain/client.entity'
import Id from '../../@shared/domain/value-object/id.value-object'
import Address from '../../@shared/domain/value-object/address.value-object'
import ClientRepository from './client.repository'

describe('Client Repository test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    })

    sequelize.addModels([ClientModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a client', async () => {
    const client = new Client({
      id: new Id('1'),
      name: 'Teste',
      email: 'teste@teste.com',
      document: '1234-5678',
      address: new Address(
        'Rua 123',
        '99',
        'Casa',
        'Criciúma',
        'SC',
        '88888-888',
      ),
    })

    const repository = new ClientRepository()
    await repository.add(client)

    const clientDb = await ClientModel.findOne({ where: { id: '1' } })

    expect(clientDb).toBeDefined()
    expect(clientDb.dataValues.id).toEqual(client.id.id)
    expect(clientDb.dataValues.name).toEqual(client.name)
    expect(clientDb.dataValues.email).toEqual(client.email)
    expect(clientDb.dataValues.document).toEqual(client.document)
    expect(clientDb.dataValues.street).toEqual(client.address.street)
    expect(clientDb.dataValues.number).toEqual(client.address.number)
    expect(clientDb.dataValues.complement).toEqual(client.address.complement)
    expect(clientDb.dataValues.city).toEqual(client.address.city)
    expect(clientDb.dataValues.state).toEqual(client.address.state)
    expect(clientDb.dataValues.zipcode).toEqual(client.address.zipCode)
    expect(clientDb.dataValues.createdAt).toStrictEqual(client.createdAt)
    expect(clientDb.dataValues.updatedAt).toStrictEqual(client.updatedAt)
  })

  it('should find a client', async () => {
    const client = await ClientModel.create({
      id: '1',
      name: 'Teste',
      email: 'teste@123.com',
      document: '1234-5678',
      street: 'Rua 123',
      number: '99',
      complement: 'Casa Verde',
      city: 'Criciúma',
      state: 'SC',
      zipcode: '88888-888',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const repository = new ClientRepository()
    const result = await repository.find(client.dataValues.id)

    expect(result.id.id).toEqual(client.dataValues.id)
    expect(result.name).toEqual(client.dataValues.name)
    expect(result.email).toEqual(client.dataValues.email)
    expect(result.address.street).toEqual(client.dataValues.street)
    expect(result.address.number).toEqual(client.dataValues.number)
    expect(result.address.complement).toEqual(client.dataValues.complement)
    expect(result.address.city).toEqual(client.dataValues.city)
    expect(result.address.state).toEqual(client.dataValues.state)
    expect(result.address.zipCode).toEqual(client.dataValues.zipcode)
    expect(result.createdAt).toStrictEqual(client.dataValues.createdAt)
    expect(result.updatedAt).toStrictEqual(client.dataValues.updatedAt)
  })
})
