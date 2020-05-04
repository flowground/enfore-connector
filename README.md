# ![LOGO](logo.png) enfore universal API **flow**ground Connector

## Description

A **flow**ground connector for the:
* enfore ERP API method getInvoices (version 0.1.0)
* enfore Contacts API method getIndividual (version 0.1.0)

Build at: 2020-04-10T10:00:00+02:00

## API Description

enfore API getInvoices - get the invoices for a specified time interval<br/>
enfore API getIndividual - get individual organisation contacts<br/>

## Authorization

This API does require authorization.

## Actions

---

### Return invoces :
> Returns invoices for the specified interval, sorted in ascending order by transaction date and time.<br/>
> <strong><br/>
> Since enfore platform was built as a distributed system, we are subject to the laws of the "Eventual consistency" model. This means that time periods close to the present may be unstable and could contain new items if the same time interval is queried again.<br/>
> <br/>
> We therefore recommend that intervals that are close to the present time should be re-requested and verified at a later time.</strong><br/>

*Tags:* `Invoices`

#### Input Parameters
* `org_id` - _required_ - ID of the organization whose data is being accessed.<br/>
* `from` - _required_ - Defines the time starting from which objects are to be returned.<br/>
Objects with exactly this date are also returned - this means that the start of a left-closed interval is defined.<br/>
Timestamp in UTC. The date-time notation as defined by RFC 3339 (https://www.ietf.org/rfc/rfc3339.txt), section 5.6, with the "Z" as time-offset. For example, 2017-07-21T17:32:28.123Z<br/>
* `to` - _required_ - Defines the time up to which objects are to be returned.<br/>
Objects with exactly this date are not returned - this means that the end of a right-open interval is defined.<br/>
Timestamp in UTC. The date-time notation as defined by RFC 3339 (https://www.ietf.org/rfc/rfc3339.txt), section 5.6, with the "Z" as time-offset. For example, 2017-07-21T17:32:28.123Z<br/>
* `limit` - _optional_ - Max number of objects to be returned per page.<br/>
Note that both the `items` as well as the `problems` arrays of the query response count towards this number to allow a simple,<br/>
consistent paging over all items (and problems) of a given timeframe.<br/>
If not given, defaults to `200`.<br/>
* `offset` - _optional_ - Offset of items and problems of where to start the next page.<br/>
Similar to limit and offset in SQL, one would obtain the second page with `limit=10&offset=10`.<br/>
Note that this paging with limit and offset is within a time interval that is specified with `from` and `to`.<br/>
If not given, defaults to `0`.<br/>
* `getFullSet` - _optional_ - Get all invoices in the specified timeframe with `from` and `to` through repeated data requests. - _otherwise_ - only one request for the `limit` and `offset` parameter.<br/>
<br/>

---

### Return individual contacts :
> Load all individual contacts from an organization

*Tags:* `Individual Contacts`

#### Input Parameters
* `org_id` - _required_ - ID of the organization whose data is being accessed.<br/>
* `limit` - _optional_ - Max number of objects to be returned per page.<br/>
Note that both the `items` as well as the `problems` arrays of the query response count towards this number to allow a simple,<br/>
consistent paging over all items (and problems) of a given timeframe.<br/>
If not given, defaults to `1000`.<br/>
* `offset` - _optional_ - Offset of items and problems of where to start the next page.<br/>
Similar to limit and offset in SQL, one would obtain the second page with `limit=10&offset=10`.<br/>
Note that this paging with limit and offset is within a time interval that is specified with `from` and `to`.<br/>
If not given, defaults to `0`.<br/>
* `getFullSet` - _optional_ - Get all individual contacts through repeated data requests. - _otherwise_ - only one request for the `limit` and `offset` parameter.<br/>
<br/>

---

## License

**flow**ground :- mVISE iPaaS / enfore-universal<br/>
Copyright © 2020, [mVISE AG](https://www.mvise.de)<br/>
contact: info@mvise.de

All files of this connector are licensed under the Apache 2.0 License. For details
see the file LICENSE on the toplevel directory.