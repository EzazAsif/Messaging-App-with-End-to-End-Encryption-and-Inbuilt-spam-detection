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
    # Define device: CPU or GPU
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    # Initialize model and move it to the correct device (CPU or GPU)
    model = SpamClassifier(5000).to(device)
    
    # Load the model with map_location for CPU or GPU
    model.load_state_dict(torch.load("../Spam Detector/spam_classifier_model.pth", map_location=device))
    model.eval()

    # Load the vectorizer for text transformation
    vectorizer = joblib.load("../Spam Detector/tfidf_vectorizer.pkl")

    # Transform the input text using the vectorizer
    vector = vectorizer.transform([text])

    # Convert the vector to a tensor and move it to the correct device
    input_tensor = torch.tensor(vector.toarray(), dtype=torch.float32).to(device)

    # Get the model prediction (no gradient required for inference)
    with torch.no_grad():
        prediction = model(input_tensor)

    # Convert the prediction into a binary value (spam or not spam)
    return True if prediction.item() > 0.5 else False