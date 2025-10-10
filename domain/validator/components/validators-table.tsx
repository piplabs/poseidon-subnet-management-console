"use client"

import { Card } from "@/common/components/card"
import Link from "next/link"

const validators = [
  {
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    stake: "1,234.56 TAO",
    commission: "5%",
    status: "Active",
  },
  {
    address: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    stake: "987.32 TAO",
    commission: "8%",
    status: "Active",
  },
  {
    address: "0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB",
    stake: "2,456.78 TAO",
    commission: "3%",
    status: "Active",
  },
  {
    address: "0x583031D1113aD414F02576BD6afaBfb302140225",
    stake: "567.89 TAO",
    commission: "10%",
    status: "Inactive",
  },
  {
    address: "0xdD870fA1b7C4700F2BD7f44238821C26f7392148",
    stake: "3,123.45 TAO",
    commission: "4%",
    status: "Active",
  },
  {
    address: "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d",
    stake: "1,789.01 TAO",
    commission: "6%",
    status: "Active",
  },
  {
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    stake: "890.12 TAO",
    commission: "7%",
    status: "Active",
  },
  {
    address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    stake: "4,567.23 TAO",
    commission: "2%",
    status: "Active",
  },
]

// Helper function to shorten wallet address
function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function ValidatorsTable() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Validators</h2>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Address</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Stake</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Commission</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {validators.map((validator, index) => (
              <tr key={index} className="border-b border-border/50 hover:bg-[#1E1F22FF] transition-colors">
                <td className="py-3 px-4">
                  <Link href={`/validators/${validator.address}`} className="flex items-center gap-2">
                    <span className="font-mono text-sm">{shortenAddress(validator.address)}</span>
                  </Link>
                </td>
                <td className="py-3 px-4 text-sm">{validator.stake}</td>
                <td className="py-3 px-4 text-sm">{validator.commission}</td>
                <td className="py-3 px-4">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      validator.status === "Active"
                        ? "bg-emerald-500/20 text-emerald-500"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {validator.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <Link href="/validators" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          View All Validators →
        </Link>
      </div>
    </Card>
  )
}
