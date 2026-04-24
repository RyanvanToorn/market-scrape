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
  currency varchar(10) [note: 'ISO 4217 currency code, e.g. USD, CHF, GBP']
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
  validated boolean [default: false, note: 'Set to true once the record has been processed by the promote-instruments job, regardless of outcome']
}

Table instrument_price_history {
  id integer [primary key]
  instrument_id integer [ref: > instruments.id]
  date date [note: 'Period start date, UTC, derived from Unix epoch']
  granularity varchar(5) [note: '"1d" = daily (1Y lookback), "1wk" = weekly (5Y lookback), "1mo" = monthly (all-time, where Yahoo returns monthly granularity)']
  open numeric(18,6) [null]
  high numeric(18,6) [null]
  low numeric(18,6) [null]
  close numeric(18,6) [null]
  adj_close numeric(18,6) [null]
  volume bigint [null]

  indexes {
    (instrument_id, date, granularity) [unique, name: 'IX_instrument_price_history_instrument_date_granularity']
  }
}

Table instrument_dividends {
  id integer [primary key]
  instrument_id integer [ref: > instruments.id]
  ex_date date [note: 'Ex-dividend date']
  payment_date date [note: 'Actual payment date; equals ex_date for daily-granularity data']
  amount numeric(18,6)

  indexes {
    (instrument_id, ex_date) [unique, name: 'IX_instrument_dividends_instrument_ex_date']
  }
}