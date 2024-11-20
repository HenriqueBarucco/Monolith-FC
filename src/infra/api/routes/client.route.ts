import express, { Request, Response } from 'express'
import ClientAdmFacadeFactory from '../../../modules/client-adm/factory/client-adm.facade.factory'
import { AddClientFacadeInputDto } from '../../../modules/client-adm/facade/client-adm.facade.interface'
import Address from '../../../modules/@shared/domain/value-object/address.value-object'

export const clientsRoute = express.Router()

clientsRoute.post('/', async (request: Request, response: Response) => {
  const facade = ClientAdmFacadeFactory.create()

  try {
    const { id, name, email, address, document } = request.body

    const clientDto: AddClientFacadeInputDto = {
      id,
      name,
      email,
      document,
      address: new Address(
        address.street,
        address.number,
        address.complement,
        address.city,
        address.state,
        address.zipCode,
      ),
    }

    await facade.add(clientDto)

    response.status(201).send()
  } catch (error) {
    response.status(400).send(error)
  }
})
