#include <SoftwareSerial.h>
#include <ArduinoJson.h>

const String url = "172.20.10.2";
const String port = "8000";
const String nomWifi = "iPhone12";
const String mdpWifi = "TXqT-12345";

const String emailAPI = "iot.garbages@gmail.com";
const String passwordAPI = "I0t!31";

String token = "";

const int RX = 10;
const int TX = 11;

SoftwareSerial ESP8266(TX, RX);


int TILT_PIN = 17; // Déclaration de la broche du tilt switch


int RECV_SON_PIN = 2; // Déclaration de la broche du récepteur ultrason
int SEND_SON_PIN = 4;// Déclaration de la broche de l'emetteur ultrason

long duration; 
int distance;

//Création de la structure Bin
struct Bin
{
  String id;
  String status;

  void setStatus(String str){
    Serial.println("bim");
    status=str;
  }
};

// déclaration des 3 poubelles
Bin bin1 = { "6217a4ab7c8a80e7e2737e11", "empty"};
Bin bin2 = { "6217a4ed9a668b8495d703fa", "empty"};
Bin bin3 = { "6222306033f4c3e56193fde5", "empty"};

void setup() {
  Serial.begin(9600);
  ESP8266.begin(9600);

  pinMode(TILT_PIN, INPUT);   // déclaration de la broche du tilt switch en entrée

  pinMode(SEND_SON_PIN, OUTPUT); // déclaration de la broche de l'emetteur ultrason en sortie
  pinMode(RECV_SON_PIN, INPUT); // déclaration de la broche du recepteur ultrason en entrée
  
  initEsp8266();
  delay(5000);
  login(emailAPI, passwordAPI);
  delay(5000);
}

void loop() {
  while(ESP8266.available()){
    Serial.println(ESP8266.readString());
  }
  delay(10);

  // // détection du tilt switch
  // if(digitalRead(TILT_PIN)!=1){
  //   bin1 = nonOverturnedBin(bin1);   
  // }  
  // else{
  //   bin1 = overturnedBin(bin1);
  // }  
  // Serial.print("Tilt : ");
  
  // Serial.println(digitalRead(TILT_PIN));

  // détection de l'utrason
  digitalWrite(SEND_SON_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(SEND_SON_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(SEND_SON_PIN, LOW);
  duration = pulseIn(RECV_SON_PIN, HIGH);

  distance = duration / 29 / 2;
  Serial.print("distance --------------------------- : ");
  Serial.println(distance);
  if( distance < 6){
    bin3 = fullBin(bin3);
  }
  else if (distance < 13){
    bin3 = typedBin(bin3);
  }
  else if (distance < 18){
    bin3 = emptyBin(bin3);
  }
  delay(1000);
}



//Envoie une commande AT à l'ESP8266
//timeout est le temps en ms d'attente pour une réponse
void envoieESP(String cmd, int timeout = 0){
  Serial.println("<-- "+cmd);
  ESP8266.println(cmd);
  long int time = millis();
  if(timeout > 0){
    String rep = "";
    while((time+timeout) > millis()){
      while(ESP8266.available()){
        String s = ESP8266.readString();
        rep = rep + s;
      }
    }
  Serial.println("--> "+rep);
  }
}

void initEsp8266(){
  envoieESP("AT+RST", 2000); //On reset l'ESP
  envoieESP("AT+CWMODE=1", 5000); //On met l'ESP en mode station (elle peut seulement se connecter a un routeur)
  envoieESP("AT+CWJAP=\""+nomWifi+"\",\""+mdpWifi+"\"", 10000); //On lui dit de se connecter à un point WIFI avec les identifiants donnés
  Serial.println(" /// FIN INIT /// ");
}


void sendHttpRequest(String req){
  Serial.println(" /// ENVOIE D'UNE REQUETE /// ");
  envoieESP("AT+CIPSTART=\"TCP\",\"" + url + "\"," + port, 4000); //Établie la connexion avec le serveur
  envoieESP(String("AT+CIPSEND=") + String(req.length() + 2), 100); //On dit combien fait de characteres la requête
  envoieESP(req); //On envoie la requête
}

//Le body est en json est doit contenir la valeur d'un des capteurs.
void updateGarbage(String idGarbage, String body){
  if(token!=""){
    String req = "PATCH /garbages/update/" + idGarbage + " HTTP/1.1\r\nHost: " + url + ":" + port + "\r\nContent-Type: application/json\r\nContent-Length: "+ String(body.length()) + "\r\nAuthorization: Bearer " + token + "\r\n\r\n"+body+"\r\n";
    sendHttpRequest(req);
  }
  // delay(10000);
  // login(emailAPI, passwordAPI);
  delay(10000);
  
}

//On se connecte à l'API et on récupère le token
void login(String email, String password){
  String body = "{\"email\": \"" + email + "\", \"password\": \"" + password + "\"}";
  String req = "POST /login HTTP/1.1\r\nHost: " + url + ":" + port + "\r\nContent-Type: application/json\r\nContent-Length: "+ String(body.length()) +"\r\n\r\n"+body+"\r\n";
  sendHttpRequest(req);
  delay(100);

  String repLine = "";
  String jsonStr = "";
  while(ESP8266.available()){
    int debutJson = -1;
    repLine = ESP8266.readString();
    Serial.println(repLine);
    debutJson = repLine.indexOf("{");
    if(debutJson >= 0){
      int finJson = repLine.lastIndexOf("}")+1;
      if(finJson >= 0){
        jsonStr = repLine.substring(debutJson, finJson);
      } 
    }
    delay(10);
  }

  if(jsonStr != ""){
    DynamicJsonDocument doc(512);
    deserializeJson(doc, jsonStr);
    token = doc["token"].as<String>();
    Serial.print("jsonStr : ");
    Serial.println(jsonStr);
    Serial.print("Le token (variable) : ");
    Serial.println(token);
  }
}

Bin emptyBin(Bin bin){
  if(!bin.status.equals("empty")){
    bin.status="empty";
    updateGarbage(bin.id,"{\"state\": \"Empty\"}");
  }
  return bin;
}

Bin typedBin(Bin bin){
  bin.status="typed";
  updateGarbage(bin.id,"{\"state\": \"Typed\"}");
  return bin;
}

Bin fullBin(Bin bin){
  if(!bin.status.equals("full")){
    bin.status="full";
    updateGarbage(bin.id,"{\"state\": \"Full\"}");
  }
  return bin;
}

Bin overturnedBin(Bin bin){
  if(bin.status.equals("empty"))
    return fullBin(bin);
  else 
    return bin;
}
Bin nonOverturnedBin(Bin bin){
  
  if(bin.status.equals("empty"))
    return bin;
  else 
    return emptyBin(bin);
}