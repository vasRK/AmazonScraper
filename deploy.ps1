kubectl delete deployment amzn-scraper-depl-aks

docker build -t srinivasr553/amzn-scraper .

docker tag srinivasr553/amzn-scraper:latest bdbbooksacr.azurecr.io/amzn-scraper:latest

docker push bdbbooksacr.azurecr.io/amzn-scraper:latest

kubectl apply -f .\k8s\amzn-scraper-depl-aks.yaml

kubectl get pods