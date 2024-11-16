export default interface Review {
    _id?: string;
    user_id: string;
    package_id: string;
    rating: number;
    feedback: string;
}