import { Layout } from "./layout";

export const DashboardPage = () => {
  return (
    <Layout title="Dashboard">
      <h5>Monthly Reports</h5>
      <div className="grid">
        <div className="s4">
          <article>
            <p>Total Views</p>
            <h5>10000</h5>
          </article>
        </div>
        <div className="s4">
          <article>
            <p>Total Post</p>
            <h5>200</h5>
          </article>
        </div>
        <div className="s4">
          <article>
            <p>Average View/Post</p>
            <h5>200</h5>
          </article>
        </div>
      </div>
    </Layout>
  );
};
