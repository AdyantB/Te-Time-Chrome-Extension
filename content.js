(function (e) {
    setInterval(() => {
        chrome.storage.local.get(["isWorkTime"]).then((values) => {
            if (!values.isWorkTime) {
                document.open();
                document.write(`
                <html>
                    <head>
                        <style>
                            * {
                                margin: 0;
                                padding: 0;
                            }
                            body {
                                height: 100vh;
                                width: 100vw;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                background-color: white;
                            }
                            .text {
                                font-size: 32px;
                                font-weight: bold;
                                font-family: 'Courier New', Courier, monospace;
                                margin-top: 16px;
                                color: black;
                            }
                            h1 {
                                font-size: 15px;
                                font-weight: bold;
                                font-family: 'Courier New', Courier, monospace;
                                margin-top: 16px;
                                color: black;
                            }
                            .logo {
                                height: 100px;
                            }
                        </style>
                    </head>
                    <body>
                        <img src="/assets/logo/tetime_logo.png" class="logo" id="logo">
                        <div class="text">Break Time</div>
                        <h1>(For continuing working, Restart timer using the extension's popup.)</h1>
                        
                    </body>
                </html>`);
                document.close();

                document.getElementById("logo").src = chrome.runtime.getURL("assets/logo/tetime_logo.png");
            }
        })
    }, 1000);

})(window)



