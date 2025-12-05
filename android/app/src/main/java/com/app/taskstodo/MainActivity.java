package com.app.taskstodo;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.speech.RecognizerIntent;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
    private static final int SPEECH_REQUEST_CODE = 123;
    private static final int MICROPHONE_PERMISSION_CODE = 200;
    private WebView webView;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    getWindow().setBackgroundDrawableResource(android.R.color.white);

        requestMicrophonePermission();
    }



    @Override
    public void onResume() {
        super.onResume();
        
        if (this.bridge != null && this.bridge.getWebView() != null) {
            webView = this.bridge.getWebView();
            webView.addJavascriptInterface(new SpeechRecognitionInterface(), "AndroidSpeech");
        }
    }

    private void requestMicrophonePermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.RECORD_AUDIO},
                    MICROPHONE_PERMISSION_CODE);
        }
    }

    public class SpeechRecognitionInterface {
        @JavascriptInterface
        public void startSpeechRecognition() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    try {
                        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
                        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, 
                                      RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
                        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "en-US");
                        intent.putExtra(RecognizerIntent.EXTRA_PROMPT, "Speak now...");
                        intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);
                        
                        startActivityForResult(intent, SPEECH_REQUEST_CODE);
                    } catch (Exception e) {
                        if (webView != null) {
                            webView.evaluateJavascript(
                                "javascript:window.dispatchEvent(new CustomEvent('speechError', { detail: 'Speech recognition not available' }))", 
                                null
                            );
                        }
                    }
                }
            });
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        
        if (requestCode == SPEECH_REQUEST_CODE) {
            if (resultCode == RESULT_OK && data != null) {
                ArrayList<String> results = data.getStringArrayListExtra(
                    RecognizerIntent.EXTRA_RESULTS
                );
                
                if (results != null && !results.isEmpty()) {
                    String spokenText = results.get(0);
                    String escapedText = spokenText
                        .replace("\\", "\\\\")
                        .replace("'", "\\'")
                        .replace("\"", "\\\"")
                        .replace("\n", "\\n")
                        .replace("\r", "\\r");
                    
                    final String javascript = "javascript:window.dispatchEvent(new CustomEvent('speechResult', { detail: '" 
                                      + escapedText + "' }))";
                    
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            if (webView != null) {
                                webView.evaluateJavascript(javascript, null);
                            }
                        }
                    });
                }
            } else {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if (webView != null) {
                            webView.evaluateJavascript(
                                "javascript:window.dispatchEvent(new CustomEvent('speechError', { detail: 'No speech detected' }))", 
                                null
                            );
                        }
                    }
                });
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        
        if (requestCode == MICROPHONE_PERMISSION_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                System.out.println("Microphone permission granted");
            } else {
                System.out.println("Microphone permission denied");
            }
        }
    }
}