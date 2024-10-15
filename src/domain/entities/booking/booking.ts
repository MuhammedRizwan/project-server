export interface Ibooking {
    _id?: string;
    user_id: string;
    package_id: string;
    members: { name: string; age: number }[];
    date: Date;
    bookingStatus: string;
    payment_status: string;
    travel_status: string;
    payment_amount: number;
    start_date: Date;
  }