module.exports = {
  client: {
    // Frontend의 파일들을 중에
    includes: ["./src/**/*.tsx"],
    // 해당 태그를 찾아서 타입을 만들고
    tagName: "gql",
    // 마지막으로 실제 Backend를 비교해서 파일을 만든다.
    service: {
      name: "uber-eats-backend",
      url: "http://localhost:4000/graphql",
    },
  },
};
