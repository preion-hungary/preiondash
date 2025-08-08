
"use client";

import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

// Extend the Window interface to include AWS
declare global {
  interface Window {
    AWS: any;
  }
}

const REGION = "eu-north-1";
const IDENTITY_POOL_ID = "eu-north-1:05055e73-a9b6-4c92-977a-703a72ca7006";
const IOT_ENDPOINT = "a1912gxnu7mdoh-ats.iot.eu-north-1.amazonaws.com";

export function useAwsIot() {
  const { toast } = useToast();

  useEffect(() => {
    if (window.AWS) {
      window.AWS.config.region = REGION;
      window.AWS.config.credentials = new window.AWS.CognitoIdentityCredentials({
        IdentityPoolId: IDENTITY_POOL_ID,
      });
    }
  }, []);

  const sendJsonCommand = (payload: object, deviceId: string) => {
     return new Promise<void>((resolve, reject) => {
      if (!window.AWS) {
        const errorMsg = "AWS SDK not loaded.";
        console.error(errorMsg);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMsg,
        });
        return reject(new Error(errorMsg));
      }

      toast({
        title: "Requesting Credentials...",
        description: "Authorizing with AWS to send command.",
      });

      window.AWS.config.credentials.get(function (err: any) {
        if (err) {
          console.error("Credential error: ", err);
          toast({
            variant: "destructive",
            title: "AWS Credential Error",
            description: err.message,
          });
          return reject(err);
        }

        const iotdata = new window.AWS.IotData({
          endpoint: IOT_ENDPOINT,
          region: REGION,
        });

        const topic = `preion/control/${deviceId}/commands`;
        
        const params = {
          topic: topic,
          payload: JSON.stringify(payload),
          qos: 0,
        };

        toast({
          title: "Sending Command...",
          description: `To topic: ${topic} with payload: ${JSON.stringify(payload)}`,
        });

        iotdata.publish(params, function (err: any, data: any) {
          if (err) {
            console.error("Publish error:", err);
            toast({
              variant: "destructive",
              title: "IoT Publish Error",
              description: JSON.stringify(err),
            });
            reject(err);
          } else {
            toast({
              title: "Command Sent Successfully",
              description: `Payload sent to ${deviceId}.`,
            });
            resolve();
          }
        });
      });
    });
  }

  const sendCommand = (command: string, deviceId: string) => {
    const payload = { command };
    return sendJsonCommand(payload, deviceId);
  };

  return { sendCommand, sendJsonCommand };
}
