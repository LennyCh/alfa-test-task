type gender = 'female' | 'male';

export default interface User {
    name: string,
    gender: gender,
    city: string,
    avatar: string,
    email: string,
    isLiked: boolean
}