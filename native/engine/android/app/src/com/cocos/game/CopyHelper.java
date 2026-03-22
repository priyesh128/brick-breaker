package com.cocos.game;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.widget.Toast;

public class CopyHelper {

    public static void copyToClipboard(String text) {
        Context context = AppActivity.getContext();
        if (context == null) return;

        ClipboardManager clipboard =
                (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);

        ClipData clip = ClipData.newPlainText("Game Score", text);
        clipboard.setPrimaryClip(clip);
    }

    public static String getClipboardText() {
        Context context = AppActivity.getContext();
        if (context == null) return "";

        ClipboardManager clipboard =
                (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);

        ClipData clipData = clipboard.getPrimaryClip();
        if (clipData != null && clipData.getItemCount() > 0) {
            CharSequence text = clipData.getItemAt(0).getText();
            return text != null ? text.toString() : "";
        }
        return "";
    }

    public static void showToast(final String message) {
        final Context context = AppActivity.getContext();
        if (context == null) return;

        ((AppActivity) context).runOnUiThread(() ->
                Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
        );
    }
}
