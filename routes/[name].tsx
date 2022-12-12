import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

interface User {
  login: string;
  name: string;
  avatar_url: string;
}

export const handler: Handlers<User | null> = {
  async GET(_, ctx) {
    const { name } = ctx.params;
    const resp = await fetch(`https://api.github.com/users/${name}`);
    if (resp.status === 404) {
      return ctx.render(null);
    }
    const user: User = await resp.json();
    return ctx.render(user);
  },
};

export default function Page({ data }: PageProps<User | null>) {
  if (!data) {
    return <h1>User not found</h1>;
  }

  return (
    <>
      <Head>
        <title>{data.name}</title>
        <link rel="icon" type="image/png" href={data.avatar_url} />
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <img src={data.avatar_url} class="w-32 h-32" />
        <h1 class="flex-grow-1 font-bold text-xl">
          {data.name} ({data.login})
        </h1>
      </div>
    </>
  );
}
