# Use the official .NET 9.0 runtime with SDK so we can build and run in one container
FROM mcr.microsoft.com/dotnet/aspnet:9.0

WORKDIR /app

# Copy csproj and restore
COPY ByasContainerHelloWorld.csproj .
RUN dotnet restore

# Copy everything else and build
COPY . .
RUN dotnet publish -c Release -o out /p:UseAppHost=false

# Expose port
EXPOSE 8080

# Run the app
ENTRYPOINT ["dotnet", "out/ByasContainerHelloWorld.dll"]
