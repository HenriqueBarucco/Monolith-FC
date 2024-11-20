import express, { Express } from 'express'
import { Sequelize } from 'sequelize-typescript'

import { productsRoute } from './routes/product.route'
import { clientsRoute } from './routes/client.route'
import { checkoutRoute } from './routes/checkout.route'
import { invoicesRoute } from './routes/invoice.route'
import { OrderModel } from '../../modules/checkout/repository/order.model'
import { ClientModel } from '../../modules/client-adm/repository/client.model'
import StoreCatalogProductModel from '../../modules/store-catalog/repository/product.model'
import AdmProductModel from '../../modules/product-adm/repository/product.model'

import InvoiceModel from '../../modules/invoice/repository/transaction.model'
import TransactionModel from '../../modules/payment/repository/transaction.model'
import InvoiceItemModel from '../../modules/invoice/repository/transaction.item.model'

export const app: Express = express()
app.use(express.json())

app.use('/products', productsRoute)
app.use('/clients', clientsRoute)
app.use('/checkout', checkoutRoute)
app.use('/invoice', invoicesRoute)

export let sequelize: Sequelize

async function setupDb() {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  })

  sequelize.addModels([
    OrderModel,
    ClientModel,
    InvoiceModel,
    TransactionModel,
    StoreCatalogProductModel,
    AdmProductModel,
    InvoiceItemModel,
  ])

  await sequelize.sync()
}

setupDb()
