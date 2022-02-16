import * as React from "react";
import {UsersStore} from "../../store/UsersStore";
import User from "../../const/User";
import {Checkbox, Icon, Image, Message} from "semantic-ui-react";
import './MainPage.scss';
import { TailSpin } from  'react-loader-spinner'
import {action} from "mobx";

export interface Users {
    usersStore: UsersStore
}

type MainPageState = {
    users: User[] | null,
    loading: boolean,
    error: any,
    isLikeFilterChecked: boolean
}

class MainPage extends React.Component<Users, MainPageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            loading: props.usersStore.loading,
            error: props.usersStore.error,
            users: props.usersStore.users,
            isLikeFilterChecked: false
        };
    }

    async componentDidMount() {
        await this.props.usersStore.loadUsers();
        this.setState({
            users: this.props.usersStore.users,
            error: this.props.usersStore.error,
            loading: this.props.usersStore.loading
        })
    }

    @action
    filterUsersByLikes = () => {
        if (!this.state.users) return;
        if (!this.state.isLikeFilterChecked) {
            const updatedUsers = this.state.users.filter((user) => user.isLiked);
            this.setState({users: updatedUsers});
        } else {
            this.setState({users: this.props.usersStore.users});
        }
        this.props.usersStore.users = this.state.users;
    }

    @action
    setLike = (email: string) => {
        if (!this.state.users) return;
        const updatedUsers = this.state.users.map(user => {
            if (user.email === email) {
                return {...user, isLiked: !user.isLiked}
            } else {
                return {...user}
            }
        });
        this.setState({users: updatedUsers});
        this.props.usersStore.users = this.state.users;
    }

    @action
    deleteUser = (email: string) => {
        if (!this.state.users) return;
        const updatedUsers = this.state.users.filter((user) => user.email !== email);
        this.setState({users: updatedUsers});
        this.props.usersStore.users = this.state.users;
    }

    Users = () => {
        if (!this.state?.users) return;
        return (
            <div className='users'>
                {
                    this.state.users.map((user: User) => {
                        return (
                            <div className='user' key={user.email}>
                                <Icon
                                    name='close'
                                    className='closeIcon'
                                    onClick={() => {
                                        this.deleteUser(user.email);
                                    }}
                                />
                                <Image src={user.avatar} size='tiny' avatar />
                                <h3>{user.name}</h3>
                                <div>{user.city}</div>
                                <Icon
                                    name='heart'
                                    size='large'
                                    className='like'
                                    color={user.isLiked ? 'red' : 'black'}
                                    onClick={() => {
                                        this.setLike(user.email);
                                    }}
                                />
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    LikesFilter = () => {
        return (
            <Checkbox
                label='Показать избранные'
                onChange={() => {
                    this.setState({isLikeFilterChecked: !this.state.isLikeFilterChecked})
                    this.filterUsersByLikes();
                }}
                className='likesFilter'
                toggle
            />
        )
    }

    Content = () => {
        return (
            <>
                {this.LikesFilter()}
                {this.Users()}
            </>
        )
    }

    render() {
        return (
            <div className='mainPageRoot'>
                {
                    this.state.loading
                        ? <div className='loader'>
                            <TailSpin color="#FF5733" height={80} width={80} />
                        </div>
                        : this.state.error
                            ? <Message error content={this.state?.error} />
                            : this.Content()
                }
            </div>
        )
    }
}

export default MainPage

