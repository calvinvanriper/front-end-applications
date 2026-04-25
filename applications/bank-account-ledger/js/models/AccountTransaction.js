export class AccountTransaction {
  constructor(date, type, description, category, amount, sequence = null, status = 'posted') {
    this.id = crypto.randomUUID();
    this.date = date;
    this.type = type;
    this.description = description;
    this.category = category;
    this.amount = amount;
    this.sequence = sequence;
    this.status = status === 'pending' ? 'pending' : 'posted';
  }
}
