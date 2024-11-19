import Address from '../../@shared/domain/value-object/address.value-object'
import Id from '../../@shared/domain/value-object/id.value-object'
import Invoice from '../domain/invoice.entity'
import Product from '../domain/product.entity'
import InvoiceGateway from '../gateway/invoice.gateway'
import InvoiceItemModel from './transaction.item.model'
import InvoiceModel from './transaction.model'

export default class InvoiceRepository implements InvoiceGateway {
  async create(input: Invoice): Promise<void> {
    await InvoiceModel.create(
      {
        id: input.id.id,
        name: input.name,
        document: input.document,
        street: input.address.street,
        number: input.address.number,
        complement: input.address.complement,
        city: input.address.city,
        state: input.address.state,
        zipCode: input.address.zipCode,
        items: input.items.map((item) => ({
          id: item.id.id,
          name: item.name,
          price: item.price,
        })),
        total: input.total,
        createdAt: input.createdAt,
      },
      {
        include: [InvoiceItemModel],
      },
    )
  }

  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: { id },
      include: [InvoiceItemModel],
    })

    return new Invoice({
      id: new Id(invoice.dataValues.id),
      name: invoice.dataValues.name,
      document: invoice.dataValues.document,
      address: new Address(
        invoice.dataValues.street,
        invoice.dataValues.number,
        invoice.dataValues.complement,
        invoice.dataValues.city,
        invoice.dataValues.state,
        invoice.dataValues.zipCode,
      ),
      items: invoice.dataValues.items.map(
        (item: InvoiceItemModel) =>
          new Product({
            id: new Id(item.dataValues.id),
            name: item.dataValues.name,
            price: item.dataValues.price,
          }),
      ),
      createdAt: invoice.dataValues.createdAt,
    })
  }
}
