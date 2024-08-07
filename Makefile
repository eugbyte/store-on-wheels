install:
	dotnet restore --property WarningLevel=0
	cd src/storeonwheels.client && npm i

start:
	dotnet run --project=src/StoreOnWheels.Server/StoreOnWheels.Server.csproj

test:
	dotnet test
	cd src/storeonwheels.client && npm run test

format:
	dotnet format --diagnostics --severity info  
	cd src/storeonwheels.client && npm run fmt

docker:
	docker build \
	--file ./src/StoreOnWheels.Server/Dockerfile \
	--progress=plain \
	--force-rm -t storeonwheelsserver \
	--build-arg "BUILD_CONFIGURATION=Debug" \
	--label "com.microsoft.created-by=visual-studio" \
	--label "com.microsoft.visual-studio.project-name=StoreOnWheels.Server" \
	src
