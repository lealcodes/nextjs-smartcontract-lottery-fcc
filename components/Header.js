import { ConnectButton } from "web3uikit";

export default function Header() {
    return (
        <div className="p-5 border-b-2 flex flex-row">
            <h1 className="py-4 px-4 font-blog text-3xl">Decentralized Lottery</h1>
            {/* MoralisAuth is not necessary here but it just assures that we dont want to connect to a server 
            This connected button does everything we did in the ManualHeader!! */}
            <div className="ml-auto py-2 px-4">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}