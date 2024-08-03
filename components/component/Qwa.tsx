"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useQRCode } from "next-qrcode";
import { SwapSDK } from "@chainflip/sdk/swap";
import { useSearchParams } from "next/navigation";
import { generateQRCodeURI } from "@/lib/qrdata";
import WebApp from "@twa-dev/sdk";
 


const swapSDK = new SwapSDK({
  network: "perseverance",
  broker: {
    url: 'https://perseverance.chainflip-broker.io/rpc/d3f87d92c7174654a789517624181972',
    commissionBps: 15,
  },
});

async function getSwapDetails(cId: string) {
  try {
    const response = await swapSDK.getStatus({ id: cId });

    const expectedDepositAmountBase10 = response?.expectedDepositAmount;

    const {
      state,
      depositAddress,
      srcAsset,
      srcChain,
      destAddress,
    } = response;

    return {
      state,
      depositAddress,
      expectedDepositAmount: expectedDepositAmountBase10,
      srcAsset,
      srcChain,
      destAddress,
    };
  } catch (error) {
    console.error('Error fetching swap details:', error);
    throw error;
  }
}

export function Qwa() {
  const { SVG } = useQRCode();
  const search = useSearchParams();
  const channelId = search.get('id');
  const [state, setState] = useState<any>(null);
  const [depositAddress, setDepositAddress] = useState<any>(null);
  const [expectedDepositAmount, setExpectedDepositAmount] = useState<any>(null);
  const [srcAsset, setSrcAsset] = useState<any>(null);
  const [srcChain, setSrcChain] = useState<any>(null);
  const [destAddress, setDestAddress] = useState<any>(null);
  const [copiedAddress, setCopiedAddress] = useState(null);
  const [data, setData] = useState('data');

  useEffect(() => {
    if (channelId) {
       
      WebApp.MainButton.setText('Close');
      WebApp.MainButton.show();
      WebApp.MainButton.enable();
      WebApp.MainButton.setParams({
        color: '#333333', // A shade of black
        text_color: '#FFFFFF', // White text
        is_active: true,
        is_visible: true,
      });
      WebApp.MainButton.onClick(() => {
        window.Telegram.WebApp.close();
      });
      getSwapDetails(channelId).then((data) => {
        setState(data.state);
        setDepositAddress(shortenAddress(data.depositAddress));
        setExpectedDepositAmount(data.expectedDepositAmount);
        setSrcAsset(data.srcAsset);
        setSrcChain(data.srcChain);
        setDestAddress(shortenAddress(data.destAddress));

        if (data.depositAddress) {
          setData(generateQRCodeURI({
            sourceChain: data.srcChain,
            sourceToken: data.srcAsset,
            recipientAddress: shortenAddress(data.depositAddress),
            amount: data.expectedDepositAmount
          }));
        }
      });
    }
  }, [channelId]);

  const copyAddress = (address: any) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  if (!channelId) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Image src="/logo.png" width={80} height={80} alt="Acme Inc" className="aspect-square" />
      </div>
    );
  }

  return (
    <div className="bg-white text-[#333] p-4 w-full max-w-[360px] shadow-lg rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <Image src="/logo.png" width={80} height={80} alt="Acme Inc" className="aspect-square" />
        <div className="bg-[#f0f0f0] px-2 py-1 rounded-md text-sm font-medium hover:bg-[#e0e0e0] cursor-pointer">
          <Link href="#" className="text-[#333]" prefetch={false}>
            {channelId}
          </Link>
        </div>
      </div>
      <div className="bg-[#f0f0f0] p-4 rounded-md mb-4 shadow-md">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-[#999]">Pay Amount</div>
          <div>{expectedDepositAmount} {srcAsset}</div>
          <div className="text-[#999]">Status</div>
          <div>{state}</div>
          <div className="text-[#999] flex flex-start items-center">Deposit Address</div>
          <div className="flex items-center justify-between">
            <div>{depositAddress}</div>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#999] hover:text-[#333]"
              onClick={() => copyAddress(depositAddress)}
            >
              {copiedAddress === depositAddress ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
            </Button>
          </div>
          <div className="text-[#999]">Expected Deposit Amount</div>
          <div>{expectedDepositAmount} {srcAsset}</div>
          <div className="text-[#999]">Source Asset</div>
          <div>{srcAsset}</div>
          <div className="text-[#999]">Source Chain</div>
          <div>{srcChain}</div>
          <div className="text-[#999] flex flex-start items-center">Destination Address</div>
          <div className="flex items-center justify-between">
            <div>{destAddress}</div>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#999] hover:text-[#333]"
              onClick={() => copyAddress(destAddress)}
            >
              {copiedAddress === destAddress ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-[#f0f0f0] p-4 rounded-md flex justify-center shadow-md">
      <SVG
  text={data}
  options={{
    margin: 2,
    width: 200,
    color: {
      dark: '#000000', // Change dark color to black
      light: '#f0f0f0', // Change light color to a darker white
    },
  }}
/>

      </div>
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CopyIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function shortenAddress(address: string) {
  const firstPart = address.slice(0, 6);
  const lastPart = address.slice(-4);
  return `${firstPart}...${lastPart}`;
}
