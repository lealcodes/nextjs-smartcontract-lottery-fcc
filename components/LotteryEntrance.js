// have a function to enter the lottery
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {

    // make entranceFee into useState so it's "hookfied" meaning when we change its value in our useEffect
    // it causes a render so this value updates and we can show it on UI
    // entranceFee is the state or the variable, and setEntranceFee is the function to update it and cause a re render
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    // Moralis knows the chainId because on Header component gets chainId from Metamask which passes it to Moralis Provider
    // (in app.js) which then passes to all the pages or all companents inside Moralis provider tags
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    // parseInt is built into javaScript
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    //console.log(`Chain ID: ${chainId}`)
    //console.log(`Raffle Address: ${raffleAddress}`)

    const dispatch = useNotification()

    const { runContractFunction: enterRaffle, isLoading, isFetching } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })
    
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {}, 
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {}, 
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {}, 
    })

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = (await getRecentWinner())
        setEntranceFee(entranceFeeFromCall)
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
        // console.log(`Entrance Fee: ${entranceFee}`) this console.log would be zero cuz setEntranceFee takes awhile to run
    }
    
    // gonna use useEffect to get the EntranceFee everytime web3 is enabled
    // Note: cant do await in useEffect so we do that async function thing
    useEffect(() => {
        if (isWeb3Enabled) {
            // try to read the raffle entrance fee
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    // solving challenge from Patrick
    // const { web3 } = useMoralis()

    // async function listenForWinnerPicked(){
    //     const lottery = new ethers.Contract(raffleAddress, abi, web3)
    //     console.log(lottery)
    //     console.log("Waiting for a winner ...");
    //     await new Promise((resolve, reject) => {
    //         lottery.once("WinnerPicked", async() => {
    //             console.log("We got a winner!");
    //             try {
    //                 console.log("updating UI")
    //                 await updateUI();
    //                 resolve();
    //             } catch (error) {
    //                 console.log(error);
    //                 reject(error);
    //             }
    //         });
    //     });
    // }

    return (
        <div className="p-5">
            {raffleAddress ? (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto" 
                        onClick={async function(){
                            await enterRaffle({
                                // onComplete:
                                // alwasy good to add onError for contract calls
                                onError: (error) => console.log(`here is an errrorrrrrr ${error}`),
                                // onScuccess only checks to see if a transaction was successfully sent to metamask
                                // it does not wait for block confirmation which is why up on handle success we do wait(1)
                                onSuccess: handleSuccess,
                            })
                            }}
                            
                        disabled={isLoading || isFetching}

                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    
                    <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
                    <div>Number of Players: {numPlayers}</div>
                    <div>Recent Winner: {recentWinner}</div>

                </div>
            ) : (
                <div>No Raffle Address Detected</div>
            )}
        
        </div>
    )
}