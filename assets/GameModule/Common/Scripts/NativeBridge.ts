import { native, sys } from "cc";

export class NativeBridge {
  private static readonly JAVA_CLASS = "com/cocos/game/CopyHelper";

  static copyToClipboard(text: string) {
    if (sys.platform !== sys.Platform.ANDROID) return;

    native.reflection.callStaticMethod(
      this.JAVA_CLASS,
      "copyToClipboard",
      "(Ljava/lang/String;)V",
      text,
    );
  }

  static getClipboardText(): string {
    if (sys.platform !== sys.Platform.ANDROID) return "";

    const text = native.reflection.callStaticMethod(
      this.JAVA_CLASS,
      "getClipboardText",
      "()Ljava/lang/String;",
    );

    return text || "";
  }

  static showToast(message: string) {
    if (sys.platform !== sys.Platform.ANDROID) return;

    native.reflection.callStaticMethod(
      this.JAVA_CLASS,
      "showToast",
      "(Ljava/lang/String;)V",
      message,
    );
  }
}
