import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from '../services/api';

type User = {
    id: string;
    name: string;
    login: string;
    avatar_url: string
}

type AuthContextData = {
    user: User | null;
    signInUrl: string;
    signOut: () => void
}

//exportar o contexto de autenticação
export const AuthContext = createContext({} as AuthContextData)

type AuthProvider = {
    children: ReactNode;
}

type AuthResponse = {
    token: string;
    user: {
        id: string;
        avatar_url: string;
        name: string;
        login: string
    }
}

export function AuthProvider(props: AuthProvider) {
    const [user, setUser] = useState<User | null>(null)

    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=a6e356c49c081b830088`; //&redirect_uri=http://localhost:3000

    //sign in do github, armazenando o token e o usuário
    async function signIn(githubCode: string){
        const response = await api.post<AuthResponse>('authenticate', {
            code: githubCode,
        })

        const { token, user } = response.data;

        //armazenar token
        localStorage.setItem('@dowhile:token', token);

        api.defaults.headers.common.authorization = `Bearer ${token}`;

        //armazenar usuário
        setUser(user)
    }

    function signOut() {
        setUser(null)
        localStorage.removeItem('@dowhile:token')
    }

    useEffect(() => {
        const token = localStorage.getItem('@dowhile:token')

        if(token){
            api.defaults.headers.common.authorization = `Bearer ${token}`;

            api.get<User>('profile').then(response => {
                setUser(response.data)
            })
        }
    }, [])

    useEffect(() => {
        const url = window.location.href;
        const hasGithubCode = url.includes('?code=');

        if (hasGithubCode) {
            const [urlWithoutCode, githubCode] = url.split('?code=')
  
            //console.log({urlWithoutCode, githubCode})
            window.history.pushState({}, '', urlWithoutCode);

            signIn(githubCode);
        }
    }, [])

    return (
        <AuthContext.Provider value={{ signInUrl, user, signOut }}>
            {props.children}
        </AuthContext.Provider>
    )
}