# TensorPilot Frontend for Python

<br>
<div align="center">
  <div>
    <img src="https://img.shields.io/badge/Editer-vscode-blue.svg?&style=flat-square&logo=visual-studio-code" alt="vscode" />
    <img src="https://img.shields.io/badge/build-passing-green.svg?&style=flat-square&logo=github" alt="build-passing" />
	
  </div>
  <div>
    <img src="https://img.shields.io/badge/Email-changkaiyan@qq.com-yello.svg?&style=flat-square" alt="email" />
    <img src="https://img.shields.io/badge/In development-v0.1 dev-blue.svg?&style=flat-square&logo=github" alt="debug" />
    
  </div>
</div>

 Our purpose is to provide a front-end for program analysis of Python functions. Displays a floating Codelens "Tensor Go" in front of each Python function. This plugin relies on a Python backend to handle a function clicked by the user, and then returns a new function text.

 Our goal is to analyze the neural network model of the function based on its text, and then map it to another kind of code. Hence the name `TensorPilot`.


## Use

Open the Python file, click tensor go, and Tensorpilot will send the following function to localhost:7070 port using HTTP request. Users should implement a server by themselves and open port 7070. The server uses the POST message to receive the HTTP request sent. The POST message is in Json format, for example: {'function': \<old function body string\>}. The server should then return a new replaced string directly in protocol body.

## License

 <img src="https://img.shields.io/badge/LICENSE-MIT-yello.svg?&style=flat-square" alt="email" />