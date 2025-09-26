"use client";

import React from "react";
import { X, Twitter, Facebook, Linkedin } from "lucide-react";
import Button from "../ui/Button";
import Link from "next/link";

interface ConnectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectTwitter: () => void;
}

const ConnectAccountModal: React.FC<ConnectAccountModalProps> = ({
  isOpen,
  onClose,
  onConnectTwitter,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#071a3a]/90 p-8 rounded-2xl shadow-lg w-full max-w-md border border-neutral-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-text-dark">
              Connect a Social Account
            </h2>
            <p className="text-gray-500 mt-1">
              Select a platform to sync your data.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 opacity-60">
            <div className="flex items-center">
              <Facebook size={24} className="mr-4 text-gray-400" />
              <div>
                <h3 className="font-semibold text-gray-600">Connect Meta</h3>
                <p className="text-sm text-gray-400">Coming Soon</p>
              </div>
            </div>
            <Button variant="secondary" disabled size="sm">
              Connect
            </Button>
          </div>
          <div
            className="flex items-center justify-between rounded-lg border border-gold p-4 cursor-pointer transition-colors hover:bg-gold/10"
            onClick={() => (window.location.href = "/api/twitter/auth")}
          >
            <div className="flex items-center">
              <Twitter size={24} className="mr-4 text-[#D4AF37]" />
              <div>
                <h3 className="font-semibold text-text-dark">
                  Connect Twitter
                </h3>
                <p className="text-sm text-gray-500">
                  Sync your profile and posts
                </p>
              </div>
            </div>
            <Button variant="primary" size="sm" className="pointer-events-none">
              Connect
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 opacity-60">
            <div className="flex items-center">
              <Linkedin size={24} className="mr-4 text-gray-400" />
              <div>
                <h3 className="font-semibold text-gray-600">
                  Connect LinkedIn
                </h3>
                <p className="text-sm text-gray-400">Coming Soon</p>
              </div>
            </div>
            <Button variant="secondary" disabled size="sm">
              Connect
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-6 text-center">
          By connecting your accounts, you agree to our{" "}
          <Link href="/terms" className="text-[#D4AF37] hover:underline">
            Terms of Service
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ConnectAccountModal;
