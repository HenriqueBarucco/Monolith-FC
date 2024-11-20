import express, { Request, Response } from 'express'
import InvoiceFacadeFactory from '../../../modules/invoice/factory/invoice.facade.factory'

export const invoicesRoute = express.Router()

invoicesRoute.get('/:id', async (request: Request, response: Response) => {
  const facade = InvoiceFacadeFactory.create()

  try {
    const invoice = await facade.find(request.params.id)

    response.status(200).json(invoice)
  } catch (error) {
    console.error(error)
    response.status(400).send(error)
  }
})
