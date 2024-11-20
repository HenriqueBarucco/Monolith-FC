import AggregateRoot from '../../@shared/domain/entity/aggregate-root.interface'
import BaseEntity from '../../@shared/domain/entity/base.entity'
import Address from '../../@shared/domain/value-object/address.value-object'
import Id from '../../@shared/domain/value-object/id.value-object'

type ClientProps = {
  id?: Id
  name: string
  email: string
  address: Address
}

export class Client extends BaseEntity implements AggregateRoot {
  private _name: string
  private _email: string
  private _address: Address

  constructor(props: ClientProps) {
    super(props.id)
    this._name = props.name
    this._email = props.email
    this._address = props.address
  }

  get name() {
    return this._name
  }

  get email() {
    return this._email
  }

  get address() {
    return this._address
  }
}
