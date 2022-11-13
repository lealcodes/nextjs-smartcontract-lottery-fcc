import { useMoralis } from "react-moralis"
import { useEffect } from "react"

export default function ManualHeader() {

    // this is a hook, a great way to work with state of our app
    // better than using a variable, page can rerender and react to change
    // lets our components notice state change
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis()

    // this useEffect is a very popular Hook, it's alwasy running and listening to the second arg
    // no dependecy array: run anytime something re-renders
    // CAREFUL with this!! because then you can get circular render
    // blank dependency array, run once on load (dont think this is true)
    // something in the array then it runs anytime something in the array changes
    useEffect(() => {
        if (typeof window !== "undefined"){
            if (window.localStorage.getItem("connected")){
                enableWeb3()
            }
        }
        console.log("useEffect RAN")
    }, [isWeb3Enabled])

    // now do useEffect to check if we disconnect
    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null account found")
            }
        })
    }, [])

    // adding these brackets {} allows us to put javScript in the return bit thats HTML
    return (<div>
        {account ? (
            <div>
                Connected to {account.slice(0,6)}...{account.slice(account.length-4)}
            </div>
        ) : (
            <button 
                onClick={async () => {
                    await enableWeb3()
                    console.log("connect button enable")
                    if(typeof window !== "undefined"){
                        // creating a local storage with key - connected and value - injected (from metaMask)
                        // application - local storage
                        window.localStorage.setItem("connected", "injected")
                    }
                }}
                disabled={isWeb3EnableLoading}
            >Connect</button>)}
    </div>)
}