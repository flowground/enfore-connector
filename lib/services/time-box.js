/**
 * flowground :- mVISE iPaaS / enforce-universal-connector
 * Copyright © 2020, mVISE AG
 * contact: info@mvise.de
 *
 * All files of this connector are licensed under the Apache 2.0 License. For details
 * see the file LICENSE on the top-level directory.
 */

//  -------------------------------------------------------
//   Time functions

function TimeBox() {
    this.tzOffset = new Date().getTimezoneOffset() * 60 * 1000;
    this.todayNow = new Date();
    this.todayYear = this.todayNow.getUTCFullYear();
    this.todayMonth = this.todayNow.getUTCMonth();
    this.todayDate = this.todayNow.getUTCDate();
    this.todayTimeStart = new Date(+(new Date(this.todayYear, this.todayMonth, this.todayDate)) - this.tzOffset);
    this.yesterdayTimeStart = new Date(+(new Date(this.todayYear, this.todayMonth, this.todayDate)) - 86400000 - this.tzOffset);
    this.yesterdayTimeEnd = new Date(+(new Date(this.todayYear, this.todayMonth, this.todayDate)) - 1 - this.tzOffset);
}
TimeBox.prototype.getThisDayStartAt = function (input) {
    const inDate = new Date(input);
    // console.log('---01: ', inDate);
    const thisDayStartAt = new Date(+(new Date(inDate.getUTCFullYear(), inDate.getUTCMonth(), inDate.getUTCDate())) - this.tzOffset);
    // console.log('---02: ', thisDayStartAt);
    return (thisDayStartAt);
}
TimeBox.prototype.getThisDayEndAt = function (input) {
    const inDate = new Date(input);
    // console.log('---01: ',inDate);
    const thisDayEndAt = new Date(+(new Date(inDate.getUTCFullYear(), inDate.getUTCMonth(), inDate.getUTCDate())) + 86399999 - this.tzOffset);
    // console.log('---02: ', thisDayEndAt);
    return (thisDayEndAt);
}
TimeBox.prototype.getDefaultStartAt = function () {
    return (this.yesterdayTimeStart);
}
TimeBox.prototype.getThisStartAt = function (input) {
    return (new Date(input));
}

//  -------------------------------------------------------

module.exports = {
    TimeBox,
};