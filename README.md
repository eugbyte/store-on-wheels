# About
Application that allow mobile trucks to broadcast their locations to user.

These mobile trucks may be food trucks. Alternatively, they may be used to deliver essential items to the elderly, disabled etc.<sup>1</sup> The general idea is to make a single trip
through the locations so save on delivery cost, stopping at common collection points instead of each individual address. 

1 <sub>I have submitted the latter idea (delivery essentials to elderly) to [Build for Good 2024](https://www.build.gov.sg/) but it was rejected.
Regardless, I think it is still an idea worth exploring.</sub>

## Live demo
[Store on Wheels website](https://ca-storeonwheels-prod-sea--mqygmr1.wittymushroom-fed3288b.southeastasia.azurecontainerapps.io)

The loading time may be slow as the container app is on the cheapest tier and subjected to cold starts.

## Preview locally
`make start`

![Preview](store_on_wheels_preview.gif)

## Develop
Install:

```
make install
```

Run the application:
```
make start
```

Test:
```
make test
```

Docker:
```
docker compose up -d
```

# Code architecture
Backend: Uses [src and tests folder for projects](https://learn.microsoft.com/en-us/dotnet/core/porting/project-structure), and MVC folder structure for individual project.
