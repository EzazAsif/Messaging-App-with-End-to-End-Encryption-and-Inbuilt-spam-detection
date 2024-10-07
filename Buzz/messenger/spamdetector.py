import torch
import torch.nn as nn
import joblib  
class SpamClassifier(nn.Module):
    def __init__(self, input_size):
        super(SpamClassifier, self).__init__()
        self.fc1 = nn.Linear(input_size, 256)  
        self.bn1 = nn.BatchNorm1d(256)         
        self.fc2 = nn.Linear(256, 128)         
        self.bn2 = nn.BatchNorm1d(128)         
        self.fc3 = nn.Linear(128, 64)          
        self.bn3 = nn.BatchNorm1d(64)          
        self.fc4 = nn.Linear(64, 32)           
        self.dropout = nn.Dropout(0.5)         
        self.fc5 = nn.Linear(32, 1)            
        self.sigmoid = nn.Sigmoid()         

    def forward(self, x):
        x = torch.relu(self.bn1(self.fc1(x)))  
        x = torch.relu(self.bn2(self.fc2(x)))  
        x = self.dropout(x)                     
        x = torch.relu(self.bn3(self.fc3(x)))  
        x = self.dropout(x)                    
        x = self.sigmoid(self.fc5(self.fc4(x)))  
        return x
  

def makepreds(text):
   
    model = SpamClassifier(5000)  

    
    model.load_state_dict(torch.load("../Spam Detector/spam_classifier_model.pth"))  
    model.eval()

    
    vectorizer = joblib.load("../Spam Detector/tfidf_vectorizer.pkl")  

    
    vector = vectorizer.transform([text])

  
    input_tensor = torch.tensor(vector.toarray(), dtype=torch.float32)

    
    with torch.no_grad():
        prediction = model(input_tensor)

    
    return True if prediction.item() > 0.5 else False
