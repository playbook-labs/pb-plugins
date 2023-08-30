
ARG ARCH=x86_64
FROM public.ecr.aws/lambda/nodejs:18-${ARCH}

# need to install canvas due to issues with architecture compatibility
RUN yum update -y
RUN yum groupinstall "Development Tools" -y
RUN yum install gcc-c++ cairo-devel pango-devel libjpeg-turbo-devel giflib-devel librsvg2-devel pango-devel bzip2-devel jq python3 -y
RUN mkdir ./lib

RUN npm install canvas --build-from-source
COPY package.json ./

RUN npm install
COPY src/index.js src/createGif.js ./
CMD [ "index.handler" ]
