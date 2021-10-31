import styles from './styles.module.scss'
import { VscGithubInverted } from 'react-icons/vsc'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/auth'

export function LoginBox() {
    //recuperando o usuário e o url de login pelo hook de context
    const {signInUrl} = useContext(AuthContext)

    return(
        <div className={styles.LoginBoxWrapper}>
            <strong>Entre e compartilhe sua mensagem</strong>
            <a href={signInUrl} className={styles.signInWithGithub}>
            <VscGithubInverted size="24" />
            Entrar com Github
            </a>
        </div>
    )
}