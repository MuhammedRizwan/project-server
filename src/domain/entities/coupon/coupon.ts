
export interface Coupon {
    _id?: string;
    coupon_code: string;
    description: string;
    percentage: string;
    max_amount: string;
    valid_upto: Date;
    is_active: boolean;
    used_by: string[];
}