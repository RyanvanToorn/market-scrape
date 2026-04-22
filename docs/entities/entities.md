Table instrument_types {
  id integer [primary key]
  description varchar
  created_on timestamp
  created_by varchar
  modified_on timestamp
  modified_by varchar
  is_active boolean
}

Table instruments {
  id integer [primary key]
  symbol varchar
  name varchar
  type_id integer [ref: > instrument_types.id]
  exchange varchar
  created_on timestamp
  created_by varchar
  modified_on timestamp
  modified_by varchar
  is_active boolean
}

Table potential_instruments {
  id integer [primary key]
  symbol varchar
  name varchar
  type_id integer [ref: > instrument_types.id]
  exchange varchar
  created_on timestamp
  created_by varchar
  modified_on timestamp
  modified_by varchar
  is_active boolean
}