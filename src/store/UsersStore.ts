import {observable, action, flow} from "mobx";
import axios from "axios";
import User from "../const/User";

export class UsersStore {

    @observable loading = true;
    @observable error = false;
    @observable users: User[] | null = null;

    @action loadUsers = flow(function* (this: UsersStore) {

        this.loading = true;
        try {
            const users = yield axios.get('https://randomuser.me/api/?results=10');
            this.users = users.data.results.map((user: any) => {
                return {
                    name: `${user.name.first} ${user.name.last}`,
                    gender: user.gender,
                    city: user.location.city,
                    avatar: user.picture.medium,
                    email: user.email,
                    isLiked: false
                }
            });
        } catch (error: any) {
            this.error = error;
            this.loading = false
        }
        this.loading = false
    })
}