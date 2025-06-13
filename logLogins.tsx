/* import storage from 'random-access-rn-file';

const file = storage('login_logs.txt');

export const logLogin = (username: string): void => {
  file.write(0, username, console.error);
};

export const getLoginHistory = (callback: (data: string | Buffer) => void): void => {
  file.read(0, 50, (err: Error | null, data: string | Buffer) => {
    if (err) {
      console.error(err);
    } else {
      callback(data);
    }
  });
};
 */

import { Platform } from "react-native";

const file =
  Platform.OS !== "web"
    ? require("random-access-rn-file")("login_logs.txt")
    : null;

export const logLogin = (username: string): void => {
  if (!file) return; // no-op on web
  file.write(0, username, console.error);
};

export const getLoginHistory = (
  callback: (data: string | Buffer) => void
): void => {
  if (!file) {
    callback(""); // empty fallback on web
    return;
  }
  file.read(0, 50, (err: Error | null, data: string | Buffer) => {
    if (err) console.error(err);
    else callback(data);
  });
};
