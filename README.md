The project uses open source library called seshat by F. Alvaro, which is under GNU General Public License version 3.0 (GPLv3).

1. Compile 'seshat' from folder 'seshat-master'
   Dependancies: "Xerces" http://xerces.apache.org/xerces-c/download.cgi
		 "Xerces" lib-dev
		 "Boost" libboost-all-dev
2. Make following changes to makefile
	a) change FLAGS to include boost_1_61_0 (latest version of "Boost")
	   
	   FLAGS=FLAGS = -O3 -Wno-unused-result -I/boost_1_61_0
	
	b) change FLAGS further so that template redeclaration error in 
	   rnnlib4seshat/WeightContainer.cpp is removed.
	   
	   FLAGS=FLAGS = -O3 -Wno-unused-result -I/boost_1_61_0 -fpermissive

3. go to /Frontend, run "npm install"

4. run "npm install" in main directory

5. run "node server.js" from main directory

6. go to /Frontend, run "npm start"

7. Application will run at localhost:3000/Login
