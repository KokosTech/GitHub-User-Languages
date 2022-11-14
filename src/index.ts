import axios from "axios";
import IRepo from "./types/IRepo";
import ILanguages from "./types/ILanguages";

const getRepos = async (user: String) => {
  try {
    const { data, status } = await axios.get<IRepo[]>(
      `https://api.github.com/users/${user}/repos`
    );

    if (status !== 200) {
      throw new Error("Error");
    }

    const res = await Promise.all(
      data.map(async (repo) => {
        const { data, status } = await axios.get<ILanguages>(
          `https://api.github.com/repos/${user}/${repo.name}/languages`
        );

        if (status !== 200) {
          throw new Error("Error");
        }

        return {
          name: repo.name,
          languages: data,
        };
      })
    );

    return res;
  } catch (error) {
    console.log(error);
  }
};

const getLanguages = (user: String) => {
  getRepos(user).then((repos: any) => {
    const languages = repos.reduce((acc: any, repo: any) => {
      Object.keys(repo.languages).forEach((language) => {
        if (acc[language]) {
          acc[language] += repo.languages[language];
        } else {
          acc[language] = repo.languages[language];
        }
      });

      return acc;
    });

    console.log(languages);

    return languages;
  });


/*   try {
    const response = await fetch(`https://api.github.com/users/${user}/repos`, {
      method: "GET",
    });
    const data = await response.json();
    //console.log(data);
    return Promise.resolve(data);
  } catch (error) {
    console.log(error);
  }
}; */

/* const getRepoLanguages = async (user: String, repo: String) => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${user}/${repo}/languages`,
      {
        method: "GET",
      }
    );
    const data = await response.json();
    //console.log(data);
    return Promise.resolve(data);
  } catch (error) {
    console.log(error);
  }
};

let dictionary: ILanguages;

const getLanguages = async (user: String) => {
  const repos: IRepo[] = await getUser(user);
  repos &&
    repos.map((repo: IRepo) => {
      getRepoLanguages(user, repo.name).then((data) => {
        console.log("DATA", data);
        data &&
          Object.keys(data).map((key) => {
            console.log("kv: ", key, data[key]);
            if (dictionary[key] === undefined || dictionary[key] === null) {
              console.log("if1", dictionary[key], key, data[key]);
              dictionary[key] = data[key];
            } else {
              console.log("else2", dictionary[key], key, data[key]);
              dictionary[key] += data[key];
            }
          });
      });
    });
}; */

const printLanguages = async (user: String) => {
  getRepos(user).then((repos) => {
    console.log("repos", repos);
  });
};

//printLanguages("KokosTech");

getLanguages("KokosTech");

/* module.exports = {
  getRepos,
  getLanguages,
};
 */
