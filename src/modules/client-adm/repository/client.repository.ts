import Address from '../../@shared/domain/value-object/address.value-object'
import Id from '../../@shared/domain/value-object/id.value-object'
import Client from '../domain/client.entity'
import ClientGateway from '../gateway/client.gateway'
import { ClientModel } from './client.model'

export default class ClientRepository implements ClientGateway {
  async add(entity: Client): Promise<void> {
    await ClientModel.create({
      id: entity.id.id,
      name: entity.name,
      email: entity.email,
      document: entity.document,
      street: entity.address.street,
      number: entity.address.number,
      complement: entity.address.complement,
      city: entity.address.city,
      state: entity.address.state,
      zipcode: entity.address.zipCode,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })
  }

  async find(id: string): Promise<Client> {
    const client = await ClientModel.findOne({ where: { id } })

    if (!client) {
      throw new Error('Client not found')
    }

    return new Client({
      id: new Id(client.dataValues.id),
      name: client.dataValues.name,
      email: client.dataValues.email,
      document: client.dataValues.document,
      address: new Address(
        client.dataValues.street,
        client.dataValues.number,
        client.dataValues.complement,
        client.dataValues.city,
        client.dataValues.state,
        client.dataValues.zipcode,
      ),
      createdAt: client.dataValues.createdAt,
      updatedAt: client.dataValues.createdAt,
    })
  }
}
