export class Message{
	_id:string;
	sender:any;
	thread:string;
	body:string;
	createdAt:string;
	time: string;
	fulltime: string;

	  constructor(_id?: string, sender?: any, thread?: string, body?: string, createdAt?: string) {
    this._id = _id;
    this.sender = sender;
    this.body = body;
    this.createdAt = createdAt;
    this.time = this._generateTime(new Date(createdAt));
    this.fulltime = this._generateDateTime(new Date(createdAt));
}

  private _generateTime(date) {
    return  date.getHours() + ":"
          + date.getMinutes() + ":"
          + date.getSeconds();
  }

  private _generateDateTime(date) {
    return date.getDate() + "/"
          + (date.getMonth()+1)  + "/"
          + date.getFullYear() + " @ "
          + this._generateTime(date);
  }

}